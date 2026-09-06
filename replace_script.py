import os
import re

files_to_update = {
    "frontend/src/pages/Classespage.tsx": [
        ("SubjectsPage", "ClassesPage"),
        ("initialSubjects", "initialClasses"),
        ("Subject", "ClassType"),
        ("subjects", "classes"),
        ("setSubjects", "setClasses"),
        ("subject", "classItem"),
        ("Subjects", "Classes"),
        ("Search by classItem", "Search by class"),
        ("Add classItem", "Add class"),
        ("Edit classItem", "Edit class"),
        ("classItem name", "Class name"),
        ("classItem, teacher", "class, teacher"),
        ("No classItems", "No classes"),
        ("classItems total", "classes total")
    ],
    "frontend/src/pages/Dashboardlayout.tsx": [
        ("Subjectspage", "Classespage"),
        ("SubjectsPage", "ClassesPage"),
        ('"/dashboard/subjects":           "Subjects"', '"/dashboard/classes":           "Classes"'),
        ('case "/dashboard/subjects":           return <SubjectsPage darkMode={darkMode} />', 'case "/dashboard/classes":           return <ClassesPage darkMode={darkMode} />')
    ],
    "frontend/src/App.tsx": [
        ('"/dashboard/subjects"', '"/dashboard/classes"')
    ],
    "frontend/src/components/Sidebar.tsx": [
        ('label: "Subjects", path: "/dashboard/subjects"', 'label: "Classes", path: "/dashboard/classes"')
    ]
}

for file_path, replacements in files_to_update.items():
    with open(file_path, 'r') as f:
        content = f.read()
    
    for old, new in replacements:
        # For case insensitive 'subject' -> 'class' in Classespage.tsx, it's better to do exact replacements
        content = content.replace(old, new)
        
    with open(file_path, 'w') as f:
        f.write(content)

print("Done replacements")
