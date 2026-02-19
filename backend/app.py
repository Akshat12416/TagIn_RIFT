from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime, timedelta
from collections import defaultdict
import os

app = Flask(__name__)
CORS(app)

client = MongoClient(os.getenv("MONGO_URI"))
db = client['product_verification']
products_collection = db['products']
transfers_collection = db['transfers']
scans_collection = db['scans']   # 👈 NEW: store verification scans


# =========================
#  Existing endpoints
# =========================

# Register product by the user
@app.route('/api/register', methods=['POST'])
def register_product():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    required_fields = [
        "name", "serial", "model", "type", "color", "date",
        "tokenId", "metadataHash", "manufacturer", "owner"
    ]
    missing = [field for field in required_fields if field not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    try:
        data['tokenId'] = str(data['tokenId'])  # force to string
        products_collection.insert_one(data)
        return jsonify({"message": "✅ Product registered successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Manufacturer dashboard routing to get all products data
@app.route('/api/products', methods=['GET'])
def get_all_products():
    try:
        products = list(products_collection.find({}, {"_id": 0}))
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Verifying product by user (backend part)
@app.route('/api/product/<token_id>', methods=['GET'])
def get_product_by_token_id(token_id):
    try:
        product = products_collection.find_one(
            {"tokenId": str(token_id)}, {"_id": 0}
        )
        if product:
            return jsonify(product), 200
        else:
            return jsonify({"error": "Product not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Ownership transfer by the manufacturer
@app.route('/api/transfer', methods=['POST'])
def transfer_ownership():
    data = request.json
    required_fields = ['tokenId', 'from', 'to', 'timestamp']

    missing = [field for field in required_fields if field not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    try:
        token_id = str(data['tokenId'])
        from_address = data['from']
        to_address = data['to']
        timestamp = data['timestamp']

        # Update the owner in the product document
        update_result = products_collection.update_one(
            {'tokenId': token_id},
            {'$set': {'owner': to_address}}
        )

        if update_result.matched_count == 0:
            return jsonify({"error": "Product not found"}), 404

        # Insert transfer record
        transfers_collection.insert_one({
            'tokenId': token_id,
            'from': from_address,
            'to': to_address,
            'timestamp': timestamp
        })

        return jsonify({"message": "Ownership transferred successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Showing transfer history to user by transfers collection
@app.route('/api/transfers/<token_id>', methods=['GET'])
def get_transfer_history(token_id):
    try:
        history = list(
            transfers_collection.find({"tokenId": str(token_id)}, {"_id": 0})
        )
        return jsonify(history), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================
#  NEW: analytics plumbing
# =========================

# 1) Log a verification scan (called from VerifyProduct)
#
# Expected JSON:
# {
#   "tokenId": "1",
#   "manufacturer": "0x...",
#   "owner": "0x...",
#   "isVerified": true/false,
#   "source": "manual" | "nfc" | "link",
#   "timestamp": "2025-11-23T10:00:00.000Z"  (optional)
#   // optional future fields:
#   // "city": "Jaipur", "lat": 26.9, "lon": 75.8
# }
@app.route('/api/scan', methods=['POST'])
def log_scan():
    data = request.json or {}

    required = ['tokenId', 'manufacturer', 'owner', 'isVerified', 'source']
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    try:
        # Parse timestamp if provided, otherwise use server time
        ts_raw = data.get('timestamp')
        ts = None
        if ts_raw:
            try:
                # handle trailing Z from JS ISO strings
                if isinstance(ts_raw, str) and ts_raw.endswith('Z'):
                    ts_raw = ts_raw.replace('Z', '+00:00')
                ts = datetime.fromisoformat(ts_raw)
            except Exception:
                ts = datetime.utcnow()
        else:
            ts = datetime.utcnow()

        scan_doc = {
            "tokenId": str(data['tokenId']),
            "manufacturer": data['manufacturer'],
            "owner": data['owner'],
            "isVerified": bool(data['isVerified']),
            "source": data.get('source', 'manual'),
            "timestamp": ts,
        }

        # Optional location fields for future heatmap
        if 'city' in data:
            scan_doc['city'] = data['city']
        if 'lat' in data and 'lon' in data:
            scan_doc['lat'] = data['lat']
            scan_doc['lon'] = data['lon']

        scans_collection.insert_one(scan_doc)
        return jsonify({"message": "scan logged"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 2) Analytics for a manufacturer
#
# GET /api/analytics/scan-stats?manufacturer=0x123&days=30
#
# Response:
# {
#   "manufacturer": "...",
#   "rangeDays": 30,
#   "totalScans": 10,
#   "verifiedScans": 8,
#   "fakeScans": 2,
#   "verificationRate": 80.0,
#   "scansBySource": { "manual": 3, "nfc": 7 },
#   "scansLast7Days": [
#     { "date": "2025-11-17", "total": 2, "verified": 2, "fake": 0 },
#     ...
#   ],
#   "topTokens": [
#     { "tokenId": "1", "total": 5, "fake": 1 },
#     ...
#   ]
# }
@app.route('/api/analytics/scan-stats', methods=['GET'])
def scan_stats():
    manufacturer = request.args.get('manufacturer')
    try:
        days = int(request.args.get('days', 30))
    except ValueError:
        days = 30

    if not manufacturer:
        return jsonify({"error": "manufacturer is required"}), 400

    try:
        now = datetime.utcnow()
        query = {"manufacturer": manufacturer}

        if days > 0:
            since = now - timedelta(days=days)
            query["timestamp"] = {"$gte": since}

        scans = list(scans_collection.find(query))

        total_scans = len(scans)
        verified_scans = sum(1 for s in scans if s.get('isVerified') is True)
        fake_scans = sum(1 for s in scans if s.get('isVerified') is False)
        verification_rate = (
            (verified_scans / total_scans) * 100.0 if total_scans > 0 else 0.0
        )

        # Scans by source
        scans_by_source = defaultdict(int)
        for s in scans:
            src = s.get('source', 'unknown')
            scans_by_source[src] += 1

        # Last 7 days breakdown (total / verified / fake)
        since_7 = now - timedelta(days=7)
        last7_scans = [s for s in scans if s.get('timestamp') and s['timestamp'] >= since_7]

        per_day = {}
        for s in last7_scans:
            ts = s.get('timestamp')
            if not ts:
                continue
            d = ts.date().isoformat()  # YYYY-MM-DD
            if d not in per_day:
                per_day[d] = {"date": d, "total": 0, "verified": 0, "fake": 0}
            per_day[d]["total"] += 1
            if s.get('isVerified') is True:
                per_day[d]["verified"] += 1
            elif s.get('isVerified') is False:
                per_day[d]["fake"] += 1

        scans_last_7_days = sorted(per_day.values(), key=lambda x: x["date"])

        # Top tokenIds by total scans (with fake count)
        token_stats = {}
        for s in scans:
            tid = s.get('tokenId')
            if tid is None:
                continue
            if tid not in token_stats:
                token_stats[tid] = {"tokenId": tid, "total": 0, "fake": 0}
            token_stats[tid]["total"] += 1
            if s.get('isVerified') is False:
                token_stats[tid]["fake"] += 1

        top_tokens = sorted(
            token_stats.values(), key=lambda x: x["total"], reverse=True
        )[:5]

        return jsonify({
            "manufacturer": manufacturer,
            "rangeDays": days,
            "totalScans": total_scans,
            "verifiedScans": verified_scans,
            "fakeScans": fake_scans,
            "verificationRate": verification_rate,
            "scansBySource": dict(scans_by_source),
            "scansLast7Days": scans_last_7_days,
            "topTokens": top_tokens
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 3) Fake scan "heatmap" by city (optional, uses city field if you send it)
#
# GET /api/analytics/fake-heatmap?manufacturer=0x123&days=30
#
# Response:
# {
#   "manufacturer": "...",
#   "rangeDays": 30,
#   "heatmap": [
#     { "city": "Jaipur", "fakeScans": 3 },
#     ...
#   ]
# }
@app.route('/api/analytics/fake-heatmap', methods=['GET'])
def fake_heatmap():
    manufacturer = request.args.get('manufacturer')
    try:
        days = int(request.args.get('days', 30))
    except ValueError:
        days = 30

    if not manufacturer:
        return jsonify({"error": "manufacturer is required"}), 400

    try:
        now = datetime.utcnow()
        since = now - timedelta(days=days)

        cursor = scans_collection.find({
            "manufacturer": manufacturer,
            "isVerified": False,          # only fake/mismatch scans
            "timestamp": {"$gte": since},
            "city": {"$exists": True}     # only those with a city attached
        })

        city_counts = defaultdict(int)
        for doc in cursor:
            city = doc.get("city", "Unknown")
            city_counts[city] += 1

        heatmap = [
            {"city": city, "fakeScans": count}
            for city, count in city_counts.items()
        ]

        return jsonify({
            "manufacturer": manufacturer,
            "rangeDays": days,
            "heatmap": heatmap
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
