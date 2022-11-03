-- migrate:up
CREATE TABLE books_authors (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    authors_id INT NOT NULL,
    CONSTRAINT books_authors_book_id_fkey FOREIGN KEY (book_id) REFERENCES books(id),
    CONSTRAINT books_authors_author_id_fkey FOREIGN KEY (authors_id) REFERENCES authors(id)
)

-- migrate:down
DROP TABLE books_authors;
