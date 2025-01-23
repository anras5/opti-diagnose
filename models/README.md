# PyTorch Serve Microservice

## Commands to create model

1. Creating model archive

- VGG16

```shell
uv run torch-model-archiver \
    --model-name vgg16 \
    --version 1.0 \
    --serialized-file vgg16/final_weights.pt \
    --handler vgg16/handler.py \
    --model-file vgg16/model.py \
    --export-path model_store \
     -r vgg16/requirements.txt
```

- MobileNetV3

```shell
uv run torch-model-archiver \
    --model-name mobilenetv3 \
    --version 1.0 \
    --serialized-file mobilenetv3_large/final_weights.pt \
    --handler mobilenetv3_large/handler.py \
    --model-file mobilenetv3_large/model.py \
    --export-path model_store \
     -r mobilenetv3_large/requirements.txt
```

2. Run a standalone container

```shell
docker run --rm -it -p 127.0.0.1:8080:8080 \
-p 127.0.0.1:8081:8081 -p 127.0.0.1:8082:8082 \
-v $(pwd)/model_store:/home/model-server/model-store \
-v $(pwd)/config.properties:/home/model-server/config.properties \
 pytorch/torchserve:latest-cpu
```
