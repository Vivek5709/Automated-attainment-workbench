from pathlib import Path
import uuid
import pandas as pd

from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
    Paragraph,
    Spacer
)

from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet


def create_pdf(summary_df):

    # ==========================================
    # 1. PROJECT DIRECTORY
    # ==========================================

    base_dir = Path(__file__).resolve().parent


    # ==========================================
    # 2. CREATE OUTPUT DIRECTORY
    # ==========================================

    output_dir = base_dir / "output"

    output_dir.mkdir(
        parents=True,
        exist_ok=True
    )


    # ==========================================
    # 3. GENERATE UNIQUE REPORT ID
    # ==========================================

    report_id = uuid.uuid4().hex[:8]


    # ==========================================
    # 4. CREATE UNIQUE PDF FILE NAME
    # ==========================================

    pdf_path = (
        output_dir /
        f"AttainX_Attainment_Report_{report_id}.pdf"
    )


    # ==========================================
    # 5. CREATE PDF DOCUMENT
    # ==========================================

    doc = SimpleDocTemplate(
        str(pdf_path),

        pagesize=(595, 842),

        rightMargin=30,
        leftMargin=30,
        topMargin=30,
        bottomMargin=30
    )


    # ==========================================
    # 6. LOAD PDF STYLES
    # ==========================================

    styles = getSampleStyleSheet()

    elements = []


    # ==========================================
    # 7. REPORT TITLE
    # ==========================================

    title = Paragraph(
        "AttainX - Attainment Summary Report",
        styles["Title"]
    )

    elements.append(title)

    elements.append(
        Spacer(1, 20)
    )


    # ==========================================
    # 8. CONVERT DATAFRAME TO TABLE DATA
    # ==========================================

    table_data = [
        summary_df.columns.tolist()
    ]

    for row in summary_df.itertuples(
        index=False
    ):

        table_data.append([
            "" if pd.isna(value)
            else str(value)

            for value in row
        ])


    # ==========================================
    # 9. CREATE TABLE
    # ==========================================

    table = Table(
        table_data,
        repeatRows=1
    )


    # ==========================================
    # 10. TABLE STYLING
    # ==========================================

    table.setStyle(
        TableStyle([

            # Header background
            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                colors.HexColor("#1f2937")
            ),

            # Header text
            (
                "TEXTCOLOR",
                (0, 0),
                (-1, 0),
                colors.white
            ),

            # Header font
            (
                "FONTNAME",
                (0, 0),
                (-1, 0),
                "Helvetica-Bold"
            ),

            # Grid
            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.5,
                colors.grey
            ),

            # Alignment
            (
                "ALIGN",
                (1, 1),
                (-1, -1),
                "CENTER"
            ),

            # Vertical alignment
            (
                "VALIGN",
                (0, 0),
                (-1, -1),
                "MIDDLE"
            ),

            # Alternate row colors
            (
                "ROWBACKGROUNDS",
                (0, 1),
                (-1, -1),
                [
                    colors.white,
                    colors.HexColor("#f3f4f6")
                ]
            ),

            # Padding
            (
                "TOPPADDING",
                (0, 0),
                (-1, -1),
                7
            ),

            (
                "BOTTOMPADDING",
                (0, 0),
                (-1, -1),
                7
            ),
        ])
    )


    elements.append(table)


    # ==========================================
    # 11. GENERATE PDF
    # ==========================================

    doc.build(elements)


    # ==========================================
    # 12. SUCCESS MESSAGE
    # ==========================================

    print(
        f"PDF created successfully:\n{pdf_path}"
    )


    # ==========================================
    # 13. RETURN PDF PATH
    # ==========================================

    return pdf_path