#!/bin/bash

echo "Creating Kafka topics..."

# Create user-deleted topic
kafka-topics --create \
  --if-not-exists \
  --topic user-deleted \
  --bootstrap-server kafka:9092 \
  --partitions 3 \
  --replication-factor 1

# Create file-deleted topic
kafka-topics --create \
  --if-not-exists \
  --topic file-deleted \
  --bootstrap-server kafka:9092 \
  --partitions 3 \
  --replication-factor 1

echo "Kafka topics created successfully!"

# List all topics to verify
kafka-topics --list --bootstrap-server kafka:9092
