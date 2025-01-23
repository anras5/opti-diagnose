```shell
uv run torch-model-archiver \
    --model-name vgg16 \
    --version 1.0 \
    --serialized-file vgg16/final_weights.pt \
    --handler vgg16/handler.py \
    --model-file vgg16/model.py \
    --export-path model_store \
     -r requirements.txt
```