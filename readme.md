# Marvel store api

Проект является оберткой над Marvel API, создан для целей проекта [marvel-store](https://github.com/phil395/marvel-store), позволяет фильтровать нерелевантные результаты (персонажи и комиксы, в которых отсутствуют нужные данные: картинка, описание, ссылка на википедию), получать рандомного персонажа из имеющихся данных, сохранять в localStorage и переиспользовать полученные результаты.

## Демонстрация проекта

Проект подключен к приложению [marvel-store](https://github.com/phil395/marvel-store) (ссылка на развернутое приложение: [marvel-store.pages.dev/](marvel-store.pages.dev/))

## Инструкция по применению

#### Установка пакета

```bash
npm i phil395/marvel-store-api#build/1.0.0

# где 'build/1.0.0' - ветка пакета с версией 1.0.0
```

#### Использование
Сигнатура всех методов, а также возвращаемые ими значения имеют хорошую типизацию.

```js
import api from 'marvel-store-api';

// Получить нужное кол-во персонажей
api.characters.get(12);

// Получить персонажа по имени
api.characters.getByName('bob');

// Получить рандомного персонажа
// При наличии достаточного кол-ва неиспользованных персонажей во внутреннем хранилище, персонаж берется из него, запрос на сервер не отправляется
// Внутреннее хранилище составляют персонажи и комиксы, полученные с помощью методов 'api.characters.get' и 'api.comics.get'
api.characters.getRandomCharacter();

// Получить нужное кол-во комиксов
api.comics.get(12);

// Получить комикс по его ID из внутреннего хранилища
api.comics.getFromHistoryById(1000);

// Сохранение состояния внутреннего хранилища в localStorage
api.saveState('characters')
api.saveState('comics')

// Восстановление состояния внутреннего хранилища из localStorage
api.restoreState()

// Служебные методы, используемые методами 'api.saveState' и 'api.restoreState'
// Позволяют получить прямой доступ к внутреннему хранилищу
// Не рекомендуются для прямого использования
const storedCharacters = api.characters.getState()
api.characters.setState(storedCharacters)

const storedComics = api.comics.getState()
api.comics.setState(storedComics)
```

#### Удаление пакета

```bash
npm remove marvel-store-api
```

#### Обновление пакета

```bash
# удаляем старый пакет командой
npm remove marvel-store-api

# устанавливаем пакет новой версии
npm i phil395/marvel-store-api#build/<version>
# где <version> - версия пакета
```