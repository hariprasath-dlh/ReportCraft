"""
Tests for PDF Converter.
"""

import pytest
from unittest.mock import patch, MagicMock
from converters.pdf_converter import convert_to_pdf


class TestPDFConverter:
    @patch("converters.pdf_converter.subprocess.run")
    def test_convert_success(self, mock_run, temp_dirs):
        """Test successful PDF conversion."""
        upload_dir, output_dir = temp_dirs

        # Create a dummy file
        dummy_file = upload_dir / "test.docx"
        dummy_file.write_text("dummy content")

        # Mock successful conversion
        mock_run.return_value = MagicMock(returncode=0, stderr="")

        # Create expected output
        expected_pdf = output_dir / "test.pdf"
        expected_pdf.write_text("dummy pdf")

        result = convert_to_pdf(str(dummy_file), str(output_dir))
        assert result == str(expected_pdf)

    def test_convert_file_not_found(self, temp_dirs):
        """Test conversion with missing input file."""
        _, output_dir = temp_dirs
        with pytest.raises(FileNotFoundError):
            convert_to_pdf("/nonexistent/file.docx", str(output_dir))

    @patch("converters.pdf_converter.subprocess.run")
    def test_convert_libreoffice_error(self, mock_run, temp_dirs):
        """Test conversion when LibreOffice returns an error."""
        upload_dir, output_dir = temp_dirs

        dummy_file = upload_dir / "test.docx"
        dummy_file.write_text("dummy content")

        mock_run.return_value = MagicMock(returncode=1, stderr="LibreOffice error")

        with pytest.raises(RuntimeError, match="PDF conversion failed"):
            convert_to_pdf(str(dummy_file), str(output_dir))
