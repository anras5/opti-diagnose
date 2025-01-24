import timm
from torch import nn


class MobileNetV3Large100(nn.Module):

    def __init__(self):
        super(MobileNetV3Large100, self).__init__()
        self.model = timm.create_model(
            "mobilenetv3_large_100",
            in_chans=3,  # Assuming RGB images
            num_classes=4,
            pretrained=False
        )

    def forward(self, x):
        return self.model(x)

    def load_state_dict(self, state_dict, strict: bool = True, assign: bool = False):
        new_state_dict = {}
        for key in state_dict:
            new_state_dict[f"model.{key}"] = state_dict[key]
        return super().load_state_dict(new_state_dict, strict, assign)
