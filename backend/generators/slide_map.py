"""
SLIDE_MAP — Maps review_type to the list of slide keys in order.
This is the reference for which slides appear and in what order.
Note: ppt_generator.py builds slides directly using builder functions,
      not by iterating this map. This file serves as documentation.

Key names:
  title       → Title slide
  abstract    → Abstract slide
  problem     → Problem Statement slide
  literature  → Literature Survey (one slide PER entry)
  existing    → Existing System slide
  proposed    → Proposed System slide
  architecture→ Architecture diagram (review_1 only, optional)
  images_25   → 25% progress images (one slide PER image)
  images_50   → 50% progress images (one slide PER image)
  output_images → Final output images (one slide PER image)
"""

SLIDE_MAP = {
    "review_0": ["title", "abstract", "problem", "existing", "proposed"],
    "review_1": ["title", "abstract", "problem", "literature", "existing", "proposed"],
    "review_2": ["title", "abstract", "problem", "literature", "existing", "proposed", "images_25"],
    "review_3": ["title", "abstract", "problem", "literature", "existing", "proposed", "images_50"],
    "review_4": ["title", "abstract", "problem", "literature", "existing", "proposed", "output_images"],
    "final":    ["title", "abstract", "problem", "literature", "existing", "proposed", "output_images"],
}

