# PyTorch Serve Microservice

## Commands to create model

1. Creating model archive

```shell
uv run torch-model-archiver \
    --model-name vgg \
    --version 1.0 \
    --serialized-file vgg/vggv1.pth \
    --handler vgg/handler.py \
    --model-file vgg/model.py \
    --export-path model_store
```

2. Run a standalone container

```shell
docker run --rm -it -p 127.0.0.1:8080:8080 \
-p 127.0.0.1:8081:8081 -p 127.0.0.1:8082:8082 \
-v $(pwd)/model_store:/home/model-server/model-store \
-v $(pwd)/config.properties:/home/model-server/config.properties \
 pytorch/torchserve:latest-cpu
```

3. Register the model (or add it to the config.properties file)

```shell
curl -X POST "http://localhost:8081/models?url=vgg.mar&initial_workers=1&synchronous=true"
```