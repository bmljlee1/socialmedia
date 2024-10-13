CREATE TABLE week9ProjectPosts (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    clerk_id TEXT NOT NULL,
    content TEXT,
    FOREIGN KEY (clerk_id) REFERENCES week9ProjectProfiles(clerk_id)
);

CREATE TABLE week9ProjectProfiles (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    clerk_id TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    bio TEXT,
    profile_image TEXT
);

CREATE TABLE week9ProjectComments (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    clerk_id TEXT NOT NULL,
    comment TEXT,
    post_id INT,
    FOREIGN KEY (clerk_id) REFERENCES week9ProjectProfiles(clerk_id),
    FOREIGN KEY (post_id) REFERENCES week9ProjectPosts(id)
)

DROP TABLE week9ProjectProfiles;
DROP TABLE week9ProjectPosts;
DROP TABLE week9ProjectComments;

-- Select posts, profiles, and comments with join
SELECT 
    p.id AS post_id, 
    p.content AS post_content, 
    prof.first_name AS post_author_first_name, 
    prof.last_name AS post_author_last_name, 
    c.comment AS comment_text, 
    comm_prof.first_name AS commenter_first_name, 
    comm_prof.last_name AS commenter_last_name
FROM 
    week9ProjectPosts p
JOIN 
    week9ProjectProfiles prof ON p.clerk_id = prof.clerk_id  -- Join posts with profiles (post author)
JOIN 
    week9projectcomments c ON p.id = c.post_id  -- Join comments with posts by post_id
JOIN 
    week9ProjectProfiles comm_prof ON c.clerk_id = comm_prof.clerk_id  -- Join comments with profiles (commenter)
ORDER BY 
    p.id, c.id;


-- Insert sample data into week9ProjectProfiles
INSERT INTO week9ProjectProfiles (clerk_id, first_name, last_name, bio, profile_image) VALUES
('clerk_001', 'John', 'Doe', 'A full-stack developer', 'john_doe.jpg'),
('clerk_002', 'Jane', 'Smith', 'Frontend engineer', 'jane_smith.jpg'),
('clerk_003', 'Alice', 'Johnson', 'Backend specialist', 'alice_johnson.jpg'),
('clerk_004', 'Bob', 'Brown', 'DevOps engineer', 'bob_brown.jpg'),
('clerk_005', 'Carol', 'Davis', 'React enthusiast', 'carol_davis.jpg');


-- Insert sample data into week9ProjectPosts
INSERT INTO week9ProjectPosts (clerk_id, content) VALUES
('clerk_001', 'Just finished my first full-stack project!'),
('clerk_002', 'Started working on a new frontend feature today!'),
('clerk_003', 'Struggling with a backend bug, any advice?'),
('clerk_004', 'Finally deployed my first microservice.'),
('clerk_005', 'Exploring new React features, stay tuned!');


-- Insert sample data into week9ProjectComments
INSERT INTO week9ProjectComments (clerk_id, comment, post_id) VALUES
('clerk_002', 'That sounds awesome, congrats!', 1),  -- Comment on post with id 1 by clerk_id 002
('clerk_003', 'Good luck! Let me know if you need help.', 1),  -- Comment on post with id 1 by clerk_id 003
('clerk_004', 'I had the same issue, check your API routes.', 3),  -- Comment on post with id 3 by clerk_id 004
('clerk_001', 'Microservices are the future!', 4),  -- Comment on post with id 4 by clerk_id 001
('clerk_005', 'Looking forward to those React updates!', 5);  -- Comment on post with id 5 by clerk_id 005




INSERT INTO week9ProjectProfiles (clerk_id, first_name, last_name, bio, profile_image) VALUES
('clerk_001', 'John', 'Doe', 'A full-stack developer', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHBlcnNvbmF8ZW58MHx8MHx8fDA%3D'),
('clerk_002', 'Jane', 'Smith', 'Frontend engineer', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGVyc29uYXxlbnwwfHwwfHx8MA%3D%3D'),
('clerk_003', 'Alice', 'Johnson', 'Backend specialist', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVyc29uYXxlbnwwfHwwfHx8MA%3D%3D'),
('clerk_004', 'Bob', 'Brown', 'DevOps engineer', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVyc29uYXxlbnwwfHwwfHx8MA%3D%3D'),
('clerk_005', 'Carol', 'Davis', 'React enthusiast', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGVyc29uYXxlbnwwfHwwfHx8MA%3D%3D');