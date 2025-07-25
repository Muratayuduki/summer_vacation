from flask import Blueprint, jsonify, request

api = Blueprint('api', __name__)

@api.route('/family/register', methods=['POST'])
def register_family():
    # Logic to register a family member
    return jsonify({'message': 'Family member registered successfully'})

@api.route('/family/request/<int:request_id>/accept', methods=['POST'])
def accept_request(request_id):
    # Logic to accept a request
    return jsonify({'message': f'Request {request_id} accepted'})