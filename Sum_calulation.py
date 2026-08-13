import pandas as pd
import numpy as np
from pathlib import Path

# Load Excel file
df = pd.read_excel("input/AttainX_sample_500_students.xlsx")

# Remove non-student rows
df = df.dropna(subset=["Enrolment No."]).copy()

# Convert marks to numeric
marks = ["CA1", "CA2", "MSE", "ESE"]

for col in marks:
    df[col] = pd.to_numeric(df[col], errors="coerce")


# Maximum marks
max_marks = {
    "CA1": 10,
    "CA2": 10,
    "MSE": 30,
    "ESE": 50
}


# -----------------------------------------
# Students scoring MORE THAN 50%
# -----------------------------------------

for col, maximum in max_marks.items():

    threshold = maximum * 0.50

    count = (df[col] > threshold).sum()

    print(
        f"{col}: {count} students scored more than 50%"
    )


# -----------------------------------------
# Course Exit Survey
# -----------------------------------------

less_50 = (df["<50"] == "<50").sum()

between_50_75 = (df[">50 and <75"] == ">50 and <75").sum()

more_75 = (df[">75"] == ">75").sum()


print("\nCourse Exit Survey")
print("------------------")

print(f"<50              : {less_50}")
print(f">50 and <75       : {between_50_75}")
print(f">75               : {more_75}")


# Total students
print(f"\nTotal Students: {len(df)}")

# ==========================================
# FINAL SUMMARY DATAFRAME
# ==========================================

summary_df = pd.DataFrame({
    "Category": [
        "CA1",
        "CA2",
        "MSE",
        "ESE",
        "Course Exit Survey <50",
        "Course Exit Survey >50 and <75",
        "Course Exit Survey >75"
    ],

    "Maximum Marks": [
        10,
        10,
        30,
        50,
        np.nan,
        np.nan,
        np.nan
    ],

    "50% Threshold": [
        5,
        5,
        15,
        25,
        np.nan,
        np.nan,
        np.nan
    ],

    "Number of Students": [
        (df["CA1"] > 5).sum(),
        (df["CA2"] > 5).sum(),
        (df["MSE"] > 15).sum(),
        (df["ESE"] > 25).sum(),
        (df["<50"] == "<50").sum(),
        (df[">50 and <75"] == ">50 and <75").sum(),
        (df[">75"] == ">75").sum()
    ]
})


# Display final summary
print("\n==========================================")
print("FINAL SUMMARY")
print("==========================================")

print(summary_df.to_string(index=False))

from pdf_generaation import create_pdf

pdf_path = create_pdf(summary_df)