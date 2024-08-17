import os
import torch
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

device = "cuda" if torch.cuda.is_available() else "cpu"
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
        return {"error": "An error occurred while generating the image."}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
