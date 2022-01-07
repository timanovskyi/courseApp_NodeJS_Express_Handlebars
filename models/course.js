const uuid = require('uuid').v4;
const fs = require('fs');
const path = require('path');


class Course {
    constructor(title, price, img) {
        this.title = title;
        this.price = price;
        this.img = img;
        this.id = uuid();
    }

    toJSON() {
        return {
            title: this.title,
            price: this.price,
            img: this.img,
            id: this.id
        }
    }

    writeFile(courses) {
        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                JSON.stringify(courses),
                (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                }
            )
        })
    }

    async save() {
        const courses = await Course.getAll();
        courses.push(this.toJSON())
        return this.writeFile(courses);
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                "utf-8",
                (err, data) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(JSON.parse(data))
                    }

                }
            )
        })

    }

    static async getById(id) {
        const courses = await Course.getAll();
        return courses.find(i => i.id === id);
    }

    async update(course) {
        const courses = await Course.getAll();
        const idx = courses.findIndex(i => i.id === course.id);
        courses[idx] = course;
        return this.writeFile(courses);
    }
}

module.exports = Course;
