export class Card {
  #front;
  #back;
  #learned;

  constructor(id, front, back, learned = false) {
    if (id == null) {
      throw new Error('Card id is required');
    }

    this.id = id;
    this.front = front;
    this.back = back;
    this.learned = learned;
  }

  get front() {
    return this.#front;
  }

  set front(value) {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error('Front must be a non-empty string');
    }

    this.#front = value;
  }

  get back() {
    return this.#back;
  }

  set back(value) {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error('Back must be a non-empty string');
    }

    this.#back = value;
  }

  get learned() {
    return this.#learned;
  }

  set learned(value) {
    this.#learned = Boolean(value);
  }

  static fromJSON(data) {
    if (!data || data.id == null) {
      return null;
    }

    const front =
      typeof data.front === 'string'
        ? data.front.trim()
        : '';

    const back =
      typeof data.back === 'string'
        ? data.back.trim()
        : '';

    if (!front || !back) {
      return null;
    }

    return new Card(
      data.id,
      front,
      back,
      data.learned ?? false,
    );
  }

  update(front, back) {
    if (front == null || back == null) {
      return;
    }

    this.front = front;
    this.back = back;
  }

  toggleLearned() {
    this.learned = !this.learned;
  }

  toJSON() {
    return {
      id: this.id,
      front: this.front,
      back: this.back,
      learned: this.learned,
    };
  }
}
