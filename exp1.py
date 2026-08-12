import pandas as pd
from docx import Document

df = pd.read_excel("Dummy data.xlsx")

values = {
    "{C1/STUDENTS}": str((df["CO-I"] > 5).sum()),
    "{C2/STUDENTS}": str((df["CO-II"] > 5).sum()),
    "{C3/STUDENTS}": str((df["CO-III"] > 5).sum()),
    "{C4/STUDENTS}": str((df["CO-IV"] > 5).sum()),
    "{C5/STUDENTS}": str((df["CO-V"] > 5).sum()),
    "{C6/STUDENTS}": str((df["CO-VI"] > 5).sum())
}

doc = Document("dummy_temp.docx")

for paragraph in doc.paragraphs:

    text = paragraph.text

    for placeholder, value in values.items():
        text = text.replace(placeholder, value)

    if text != paragraph.text:

        for run in paragraph.runs:
            run.text = ""

        paragraph.runs[0].text = text


doc.save("updated_report.docx")

print("Done!")