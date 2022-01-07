const path = require('path');
const fs = require('fs');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'card.json'
)

class Card {

    static writeFile(card) {
        return new Promise(((resolve, reject) => {
            fs.writeFile(p,
                JSON.stringify(card),
                (err, data) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(card)
                    }
                })
        }))
    }

    static async add(course) {
        const card = await this.fetch();

        const idx = card.courses.findIndex(c => c.id === course.id);
        const candidate = card.courses[idx];

        if (candidate) {
            candidate.count++
            card.courses[idx] = candidate;
        } else  {
            course.count = 1;
            card.courses.push(course)
        }

        card.price += +course.price;

        return this.writeFile(card);
    }


    static async remove(id) {
        const card = await this.fetch();
        const idx = card.courses.findIndex(c => c.id === id);
        const course = card.courses[idx];

        if (course.count === 1) {
            card.courses = card.courses.filter(i => i.id !== id)
        } else {
            course.count--
        }

        card.price -= course.price;

        return this.writeFile(card);
    }

    static async fetch() {
        return new Promise(((resolve, reject) => {
            fs.readFile(p, 'utf-8', (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(JSON.parse(data))
                }
            })
        }))
    }
}

module.exports = Card;
