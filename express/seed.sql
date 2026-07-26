INSERT INTO user(user_id, first_name, last_name, password_hash, email)
VALUES (NULL, "Kenneth", "Barclay", "39fjiejfew9", "kdb@conestoga.com"),
       (NULL, "Alex", "Sturgeon", "828u310294i", "as@conestoga.com"),
       (NULL, "Gurkirat", "Singh", "28u12uf9ejfa9efj", "gs@conestoga.com"),
       (NULL, "no rush", "no worries", "absolutelynorushguys", "nonw@conestoga.com");

INSERT INTO student(student_id, User_user_id)
VALUES (123456, 1),
       (567891, 2);

INSERT INTO teacher(teacher_id, User_user_id)
VALUES (654321, 3),
       (198765, 4);

INSERT INTO class(class_id, name, teacher_teacher_id)
VALUES ("PROG123", "Computer Hardware Development", 654321);

INSERT INTO assignment(assignment_id, due_date, class_class_id, file)
VALUES (1, "2026-07-30", "PROG123", "/filepath");

INSERT INTO student_has_class(student_student_id, class_class_id)
VALUES (123456, "PROG123");

INSERT INTO student_has_assignment(student_student_id, assignment_assignment_id, file_path, notes)
VALUES (123456, 1, "/filepath", "seed data");

INSERT INTO lecture(lecture_id, date, duration_hours, content, class_class_id)
VALUES (1, "2026-07-29", 3, "material surrounding hardware development", "PROG123");

