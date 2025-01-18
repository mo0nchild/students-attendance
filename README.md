<<<<<<< HEAD
# Students Attendance
=======
# Student Attendances
>>>>>>> 5f95f6816dcb7ec53e8d42c04e330ba2b2f88b57
Этот проект предназначен для проверки посещаемости студентов на парах с использованием RFID Reader устройства.

## Требования

- Kotlin, JDK, Node JS, MAVEN
- Git установленный в системе
- Учетная запись GitVerse
- Поддерживаемая операционная система (Windows, macOS или Linux).

## Установка

### Запуск приложения

1. [Скачайте последний релиз](https://gitverse.ru/byterbrod387/rfid-students/releases/tag/desktop)
2. Распакуйте содержимое архива
3. Запустите установщик `rfidreader.desktop-1.0.0-setup.exe`

### Сборка приложения

1. Склонируйте этот репозиторий:
```git clone https://gitverse.ru/byterbrod387/rfid-students.git```

2. Восстановите зависимости (Powershell)

На этом шаге для начала необходимо настроить файл [configuration.json](build-scripts/configuration.json) (указакать пути к установленным JAVA и MAVEN)

```powershell
    Set-ExecutionPolicy Bypass -Scope Process

    # Запустить сборку серверной части проекта
    .\build-scripts\prepare-server.ps1

    # Востановить зависимости проекта клиентской части 
    cd .\rfidreader.desktop\; npm install

    # Запустить сборку .EXE файла
    npm run build:unpack
```
После чего в в папке `rfidreader.desktop/dist/win-unpacked` будет сгенерирован файл `rfidreader.desktop.exe`

## Конфигурация

Файл [configuration.json](build-scripts/configuration.json) - в этом файле происводится настройка путей для сборки серверной части.

Файл [application.properties](.rrfidreader.server/src/main/resources/application.properties) - в этом файле указываете базу данных и зивисимости для нее, а также базовую настройку для Spring.


## Использованные технологии

- [Написано на Kotlin с использованием фреймворка Spring](https://spring.io/guides/tutorials/spring-boot-kotlin)
- [Фреймворк Electron](https://www.electronjs.org/ru/docs/latest/ "Electron - это фреймворк для разработки десктопных приложений с использованием HTML, CSS и JavaScript.")

## Работу выполнили студенты 4 курса группы бОИС-211

- Максим Дмитриев
- Данил Тюленев
- Дмитрий Гайдаев
- Людмила Корчанова 
