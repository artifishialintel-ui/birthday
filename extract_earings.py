import cv2
import numpy as np
import os

try:
    from rembg import remove
except ImportError:
    print("rembg is not installed. Please install it with: pip install rembg")
    exit(1)

def extract_high_quality(img_path, prefix, out_dir):
    print(f"Processing {img_path} with high quality AI extractor...")
    
    with open(img_path, 'rb') as i:
        input_data = i.read()
    
    output_data = remove(input_data)
    
    nparr = np.frombuffer(output_data, np.uint8)
    img_bgra = cv2.imdecode(nparr, cv2.IMREAD_UNCHANGED)
    
    if img_bgra is None or img_bgra.shape[2] != 4:
        print("Failed to remove background or image has no alpha channel.")
        return

    alpha = img_bgra[:, :, 3]
    _, thresh = cv2.threshold(alpha, 10, 255, cv2.THRESH_BINARY)
    
    kernel = np.ones((5,5), np.uint8)
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
    
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    contours = sorted(contours, key=cv2.contourArea, reverse=True)
    
    # Filter out tiny noise contours
    contours = [c for c in contours if cv2.contourArea(c) > 1000]
    
    if not contours:
        print("No items found.")
        return
        
    print(f"Found {len(contours)} items.")
    
    count = 1
    for c in contours[:3]: # Limit to top 3 objects
        x, y, w, h = cv2.boundingRect(c)
        pad = 15
        x1 = max(0, x - pad)
        y1 = max(0, y - pad)
        x2 = min(img_bgra.shape[1], x + w + pad)
        y2 = min(img_bgra.shape[0], y + h + pad)
        
        crop_img = img_bgra[y1:y2, x1:x2]
        
        out_path = os.path.join(out_dir, f'{prefix}_{count}_hq.webp')
        cv2.imwrite(out_path, crop_img, [cv2.IMWRITE_WEBP_QUALITY, 100])
        print(f"Saved {out_path}")
        count += 1

out_dir = r'd:\PROJECTS\ForHer\images'
extract_high_quality(r'd:\PROJECTS\ForHer\images\earings_real.png', 'earing', out_dir)
