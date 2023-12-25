FROM ngrok/ngrok:alpine
USER root

# ENV NGROK_AUTHTOKEN 
# ENV NGROK_ADDR 

RUN apk add curl
RUN apk update && apk add bash

COPY ngrok.sh ./

ENTRYPOINT [ "sh", "ngrok.sh" ]

