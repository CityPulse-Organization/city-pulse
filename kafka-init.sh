#!/bin/bash

echo "Waiting for Kafka to be ready..."
sleep 10

echo "Creating Kafka topics..."

# Create user-deleted topic
kafka-topics --create \
  --if-not-exists \
  --topic user-deleted \
  --bootstrap-server localhost:9092 \
  --partitions 3 \
  --replication-factor 1

echo "Kafka topics created successfully!"

# List all topics to verify
kafka-topics --list --bootstrap-server localhost:9092
