import json
from augustus import Pairing


def request_handler(event, context):
    sectionId = event["queryStringParameters"]["sectionId"]
    round = event["queryStringParameters"]["round"]
    body = json.loads(event["body"])
    players = body["players"]
    p = Pairing(sectionId, round, players)
    pairings = p.generatePairings()
    return {
        'statusCode': 200,
        'body': json.dumps({"pairings": pairings}),
    }
