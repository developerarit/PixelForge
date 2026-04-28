---

# PixelForge

PixelForge is a modular image processing service that handles image uploads and transformations through a simple, service-oriented architecture.

The system is organized as a monorepo with two core components:

* **dock/** — API layer responsible for handling requests and managing file input/output
* **hammer/** — processing service responsible for performing image transformations

---

## Architecture

PixelForge separates request handling from processing to keep responsibilities clear and focused.

The flow is straightforward:

1. The API receives an image and transformation parameters
2. The image is stored locally
3. The processing service is invoked
4. A transformed image is generated and returned

---

## Project Structure

```bash
PixelForge/
  ├── dock/
  └── hammer/
```

---

## Summary

PixelForge provides a clean and minimal foundation for handling image transformation workflows using a dedicated API layer and a separate processing engine.
