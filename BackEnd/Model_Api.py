#pip install fastapi uvicorn torch torchvision transformers accelerate diffusers numpy==1.24.1
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import torch
from diffusers import StableDiffusionPipeline
from io import BytesIO
import base64

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"]
)

device = "cpu"
dtype = torch.float32

pipeline = StableDiffusionPipeline.from_pretrained(
    "CompVis/stable-diffusion-v1-4",
    torch_dtype=dtype,
)
pipeline.to(device)

@app.get("/")
def generate(prompt: str):
    try:
        image = pipeline(prompt, guidance_scale=8.5).images[0]
        buffer = BytesIO()
        image.save(buffer, format="PNG")
        imgstr = base64.b64encode(buffer.getvalue()).decode("utf-8")

        return {"image": imgstr}
    except Exception as e:
        return {"error": str(e)}

print(torch.cuda.is_available())
