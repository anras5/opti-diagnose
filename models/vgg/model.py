import torch.nn as nn
from torchvision import models


class VGGNet(nn.Module):
    def __init__(self, num_classes=5):
        super(VGGNet, self).__init__()
        self.vgg = models.vgg16(pretrained=False)
        num_ftrs = self.vgg.classifier[6].in_features
        self.vgg.classifier[6] = nn.Linear(num_ftrs, num_classes)

    def forward(self, x):
        return self.vgg(x)

    def load_state_dict(self, state_dict, strict: bool = True, assign: bool = False):
        new_state_dict = {}
        for key in state_dict:
            if key.startswith("features") or key.startswith("classifier"):
                new_state_dict[f"vgg.{key}"] = state_dict[key]
            else:
                new_state_dict[key] = state_dict[key]
        return super().load_state_dict(new_state_dict, strict, assign)
