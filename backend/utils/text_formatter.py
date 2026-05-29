import re

def content_to_bullet_points(text: str) -> list[str]:
    """
    Convert user content into a list of clean bullet point strings.
    Strips common leading markers (-, •, *, 1., a), etc.) and empty lines.
    """
    if not text or not text.strip():
        return []

    lines = [l.strip() for l in text.split("\n") if l.strip()]

    # If user wrote everything on one long line, split by sentence instead
    if len(lines) == 1 and len(lines[0]) > 150:
        # Split on sentence boundaries (. ! ?) followed by space
        # A simple regex split is fine, but we can do a quick negative lookbehind for e.g. / i.e.
        sentences = re.split(r'(?<!\be\.g\.)(?<!\bi\.e\.)(?<=[.!?])\s+', lines[0])
        lines = [s.strip() for s in sentences if s.strip()]

    points = []
    for l in lines:
        # Strip common leading bullet / number markers
        cleaned = re.sub(r'^[\-\•\·\–\—\*]\s*', '', l)
        cleaned = re.sub(r'^\d+[\.\)\-]\s*', '', cleaned)
        cleaned = re.sub(r'^\([a-zA-Z0-9]+\)\s*', '', cleaned)
        cleaned = re.sub(r'^[a-zA-Z][\.\)]\s*', '', cleaned)
        cleaned = cleaned.strip()
        if cleaned:
            points.append(cleaned)

    return points
