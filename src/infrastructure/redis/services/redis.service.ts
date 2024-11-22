import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
// робить сервіс доступним для інжекції в інших частинах програми
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,
  ) {}
  // RedisService отримує клієнт Redis,
  // визначений у змінній REDIS_CLIENT, завдяки декоратору @Inject
  // @Inject підставляє потрібний об'єкт або сервіс у клас автоматично
  // private означає, що цю змінну можна використовувати тільки всередині цього класу
  // readonly означає, що її не можна змінити після ініціалізації
  // Redis задає тип, що допомагає працювати з Redis командами

  public async addOneToSet(hash: string, value: string): Promise<number> {
    return await this.redisClient.sadd(hash, value);
    // sadd додає унікальні елементи до множини в Redis
    // hash: ключ, під яким зберігається множина, value: значення, яке додається до множини
    // Повертає кількість елементів, доданих до множини
  }

  public async remOneFromSet(key: string, setMember: string): Promise<number> {
    return await this.redisClient.srem(key, setMember);
  }
  // srem видаляє елемент із множини, якщо він є у ній, є повертає кількість елементів, які були видалені
  // key: ключ множини, setMember: значення, яке потрібно видалити з множини

  public async deleteByKey(key: string): Promise<number> {
    return await this.redisClient.del(key);
  }
  // del видаляє весь контент з множини, якщо він є у ній, повертає кількість елементів, які були видалені
  // key: ключ множини, який потрібно видалити з бази даних

  public async sMembers(key: string): Promise<string[]> {
    return await this.redisClient.smembers(key);
  }
  // sMember отримує всі елементи множини (виводить масив всіх елементів множини)
  // key: ключ множини. Повертає масив елементів, що містяться в множині

  public async expire(key: string, time: number): Promise<number> {
    return await this.redisClient.expire(key, time);
  }
  // expire встановлює таймаут на ключ, після якого ключ автоматично видаляється
  // key: ключ, для якого встановлюється таймау, time: час в секундах до видалення ключа
  // Повертає 1, якщо таймаут було успішно встановлено, або 0 у разі невдачі
}
