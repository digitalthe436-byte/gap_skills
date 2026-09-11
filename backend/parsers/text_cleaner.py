"""Text Cleaning & Preprocessing Module.

Sanitizes raw text, strips HTML tags, removes non-ASCII artifacts,
normalizes casing/whitespace, and segments job descriptions into
Required and Preferred qualification sections.
"""

import re
import unicodedata
from typing import Dict, List, Set, Tuple

# Common English stop words for vector/keyword preprocessing
STOP_WORDS: Set[str] = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
    "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
    "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't",
    "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during",
    "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
    "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here",
    "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i",
    "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's",
    "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself",
    "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought",
    "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she",
    "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than",
    "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there",
    "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this",
    "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't",
    "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's",
    "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom",
    "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll",
    "you're", "you've", "your", "yours", "yourself", "yourselves"
}

HTML_TAG_REGEX = re.compile(r"<[^>]+>")
WHITESPACE_REGEX = re.compile(r"[ \t]+")
NEWLINE_REGEX = re.compile(r"\n\s*\n+")

# Section headers regex patterns
REQUIRED_HEADERS = [
    r"required\s*(?:skills|qualifications|requirements|competencies)?",
    r"basic\s*(?:qualifications|requirements)",
    r"minimum\s*(?:qualifications|requirements)",
    r"what\s+you(?:'ll|\s+will)\s+need",
    r"what\s+we(?:'re|\s+are)\s+looking\s+for",
    r"must\s+have",
    r"requirements",
    r"qualifications"
]

PREFERRED_HEADERS = [
    r"preferred\s*(?:skills|qualifications|requirements|competencies)?",
    r"desired\s*(?:skills|qualifications)",
    r"nice\s+to\s+have",
    r"bonus\s*(?:points|skills)?",
    r"good\s+to\s+have",
    r"plus",
    r"plusses",
    r"what\s+gives\s+you\s+an\s+edge"
]

REQUIRED_PATTERN = re.compile(
    r"^(?:[\s*#\->•]*)(?:" + "|".join(REQUIRED_HEADERS) + r")\s*[:\n]",
    re.IGNORECASE | re.MULTILINE
)

PREFERRED_PATTERN = re.compile(
    r"^(?:[\s*#\->•]*)(?:" + "|".join(PREFERRED_HEADERS) + r")\s*[:\n]",
    re.IGNORECASE | re.MULTILINE
)


def strip_html(text: str) -> str:
    """Strip HTML markup tags from text."""
    if not text:
        return ""
    return HTML_TAG_REGEX.sub(" ", text)


def normalize_unicode(text: str) -> str:
    """Normalize unicode characters (NFKD) and convert smart quotes/bullets."""
    if not text:
        return ""
    # Replace common unicode quotes and bullet characters
    replacements = {
        "“": '"', "”": '"', "‘": "'", "’": "'",
        "•": " * ", "–": "-", "—": "-", "…": "...",
        "\u00a0": " ", "\t": " "
    }
    for orig, rep in replacements.items():
        text = text.replace(orig, rep)
    # Normalize unicode to decompose accents while preserving ASCII characters
    normalized = unicodedata.normalize("NFKD", text)
    # Filter non-printable control characters except standard whitespace
    cleaned = "".join(ch for ch in normalized if ch.isprintable() or ch in "\n\r\t")
    return cleaned


def clean_text(text: str, remove_stop_words: bool = False) -> str:
    """Sanitize, normalize casing, and format raw unstructured text.

    Args:
        text: Raw text string.
        remove_stop_words: If True, filters out standard English stop words.

    Returns:
        Cleaned, normalized string.
    """
    if not text:
        return ""

    text = strip_html(text)
    text = normalize_unicode(text)

    # Collapse multiple inline spaces
    lines = [WHITESPACE_REGEX.sub(" ", line).strip() for line in text.splitlines()]
    text = "\n".join(lines)

    # Collapse excessive blank lines to maximum 2 newlines
    text = NEWLINE_REGEX.sub("\n\n", text).strip()

    if remove_stop_words:
        tokens = re.findall(r"\b[a-zA-Z0-9_+#.-]+\b", text)
        filtered = [t for t in tokens if t.lower() not in STOP_WORDS]
        return " ".join(filtered)

    return text


def segment_job_description(jd_text: str) -> Dict[str, str]:
    """Segment job description text into Required, Preferred, and General sections.

    Returns a dict with keys:
      - 'required': Text specifically under required qualifications
      - 'preferred': Text specifically under preferred / nice-to-have
      - 'general': Text not explicitly filed under either (or whole text if not segmented)
      - 'full': Cleaned full text
    """
    cleaned_jd = clean_text(jd_text)
    lines = cleaned_jd.splitlines()

    current_section = "general"
    sections = {
        "required": [],
        "preferred": [],
        "general": []
    }

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        # Check for Preferred header first
        if any(re.search(r"\b" + h + r"\b", stripped, re.I) for h in PREFERRED_HEADERS):
            current_section = "preferred"
            continue
        # Check for Required header
        elif any(re.search(r"\b" + h + r"\b", stripped, re.I) for h in REQUIRED_HEADERS):
            current_section = "required"
            continue

        sections[current_section].append(stripped)

    required_text = "\n".join(sections["required"]).strip()
    preferred_text = "\n".join(sections["preferred"]).strip()
    general_text = "\n".join(sections["general"]).strip()

    # If no explicit sections were found, fall back to whole text in required/general
    return {
        "required": required_text if required_text else cleaned_jd,
        "preferred": preferred_text,
        "general": general_text,
        "full": cleaned_jd
    }
