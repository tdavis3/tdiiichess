# PairingEngine Microservice

This microservice is the pairing engine for TDIII Chess

It is implemented on AWS Lambda and Amazon API Gateway in Python

URL Params:
- sectionId (string)
- round (int)

Body:
- players (list)

Request URL: (AWS Lambda function)
- No API Key required

https://api.tdiiichess.com/pairingEngine?sectionId={PARAM}&round={PARAM}

Dependencies:
- networkx
- itertools

---
WINDOWS Setup

Transfer updated files to ubuntu

Run `cp /mnt/c/Users/Tyrone/PycharmProjects/aws_deployment_package/augustus.py /home/td3/aws_development_package/`

Install dependency

Working dir should be /mnt/c/Users/Tyrone/PycharmProjects/aws_deployment_package

Then run `pip3 install numpy -t .`

Zip files in /mnt/c/Users/Tyrone/PycharmProjects/aws_deployment_package then upload the zipped file to the lambda
 function 


