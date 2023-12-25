Simple dockerfile to create ngrok tunneling

example service
<code>
  ngrok:
    container_name: ngrok
    networks:
      - dropin
    image: ngrok
    environment:
      NGROK_AUTHTOKEN: $NGROK_AUTH
      NGROK_ADDR: api:$API_PORT
    depends_on:
      - transaction
    volumes:
      - ./.env:/.env
</code>

run sh ngrok.sh 
to build image

specify env variables
> NGROK_AUTHTOKEN
> NGROK_ADDR


and specify /.env volume 
script will add NGROK_URL variables



! Work with M1 processors