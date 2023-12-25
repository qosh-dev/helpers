#!/bin/sh

# Set local port from command line arg or default to 8080
LOCAL_PORT=${NGROK_ADDR}

echo "Start ngrok in background on address/port [ $LOCAL_PORT ]"
nohup ngrok http ${LOCAL_PORT} &
>/dev/null &

echo "Extracting ngrok public url ."
echo
NGROK_PUBLIC_URL=""
TEST=""

sleep 5
export NGROK_PUBLIC_URL=$(curl --silent --max-time 10 --connect-timeout 5 \
  --show-error http://127.0.0.1:4040/api/tunnels |
  sed -nE 's/.*public_url":"https:..([^"]*).*/\1/p')

KEY=NGROK_URL
VALUE=https://$NGROK_PUBLIC_URL
FILENAME=.env

if test -f "$FILENAME"; then
  if grep -q "^$KEY=" "$FILENAME"; then
    # Update existing variable
    sed -i "s/^$KEY=.*/$KEY=$VALUE/" "$FILENAME"
  else
    # Insert new variable
    echo "$KEY=$VALUE" >>"$FILENAME"
  fi
else
  echo "volume $FILENAME does not exist."
  echo "to get url specify .env volume"
fi

echo $VALUE

while [ -z "$TEST" ]; do
  sleep 1
done
