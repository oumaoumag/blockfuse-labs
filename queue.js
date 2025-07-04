class Queue {
    // enqueue, dequeue, print, empty, size, first
    constructor() {
        this.items = [];
        this.front = 0;
        this.back = 0;
    }

    enqueue(item) {
        this.items[this.back] = item;
        this.back += 1

        return item;
    }

    dequeue() {
        const item = this.items[this.front];
        delete this.items[this.front];
        this.front += 1;
        return item;
    }
}

const sms = new Queue();
console.log(sms.items)
sms.enqueue("Jaja")
console.log(sms.items)
sms.enqueue("Godwin")
sms.enqueue("Raphael")
console.log(sms.items)
sms.dequeue()
console.log(sms.items)

