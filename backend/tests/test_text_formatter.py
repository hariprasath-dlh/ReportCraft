import pytest
from utils.text_formatter import content_to_bullet_points

def test_content_to_bullet_points_empty():
    assert content_to_bullet_points("") == []
    assert content_to_bullet_points("   ") == []
    assert content_to_bullet_points(None) == []

def test_content_to_bullet_points_single_short_line():
    assert content_to_bullet_points("Hello World") == ["Hello World"]

def test_content_to_bullet_points_manual_bullets():
    text = "- Item 1\n• Item 2\n* Item 3\n- Item 4"
    expected = ["Item 1", "Item 2", "Item 3", "Item 4"]
    assert content_to_bullet_points(text) == expected

def test_content_to_bullet_points_numbered_lists():
    text = "1. First item\n2) Second item\n3- Third item\n(a) Fourth item\na. Fifth item"
    expected = ["First item", "Second item", "Third item", "Fourth item", "Fifth item"]
    assert content_to_bullet_points(text) == expected

def test_content_to_bullet_points_single_long_line_sentence_split():
    long_line = "This is the first sentence in a very long paragraph that will exceed one hundred and fifty characters in length to trigger the sentence splitting logic. This is the second sentence! Here is the third one? And a final sentence to finish the test."
    expected = [
        "This is the first sentence in a very long paragraph that will exceed one hundred and fifty characters in length to trigger the sentence splitting logic.",
        "This is the second sentence!",
        "Here is the third one?",
        "And a final sentence to finish the test."
    ]
    assert content_to_bullet_points(long_line) == expected

def test_content_to_bullet_points_single_long_line_no_split_under_limit():
    short_line = "This is a sentence. It is under 150 characters."
    assert content_to_bullet_points(short_line) == [short_line]

def test_content_to_bullet_points_abbreviations():
    # Negative lookbehind test for e.g. / i.e.
    text = "We support multiple formats, e.g. bullet points, which are clean list items that help represent slide content in a very visual and concise manner, exceeding 150 characters. This is another sentence that should be split out."
    expected = [
        "We support multiple formats, e.g. bullet points, which are clean list items that help represent slide content in a very visual and concise manner, exceeding 150 characters.",
        "This is another sentence that should be split out."
    ]
    assert content_to_bullet_points(text) == expected
