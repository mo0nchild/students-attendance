# Students Attendance
Этот проект предназначен для проверки посещаемости студентов на парах с использованием RFID Reader устройства.

## Требования

- Kotlin, 
- Git установленный в системе
- Учетная запись GitVerse
- Поддерживаемая операционная система (Windows, macOS или Linux).

## Установка

### Запуск приложения

1. [Скачайте последний релиз](https://gitverse.ru/byterbrod387/rfid-students)
2. Распакуйте содержимое архива
3. Запустите приложение `startup.ps1`

### Сборка приложения

1. Склонируйте этот репозиторий:
```git clone https://gitverse.ru/byterbrod387/rfid-students.git```

2. Восстановите зависимости

```bash
    Set-ExecutionPolicy Bypass -Scope Process
    .\startup.ps1
```


## Конфигурация

В файле [configuration.json](.rfidreader.client/configuration.json)

```json
{
    "backendIP": "https://127.0.0.1",
    "backendPort": "8443"
}
```
В ключе `backendIP` поле `https://127.0.0.1` отвечает за адресс сервера.
В `backendPort` в поле `8443` указывается на порт сервера.



В файле [localhost.cnf](certificates-gen/localhost.cnf)

```cnf
{
    IP.1 = 127.0.0.1
    IP.2 = 192.168.0.103
    DNS.1 = localhost
    DNS.2 = localhost.localdomain
    DNS.3 = dev.local 
}
```
Поменять на домен в котором лежит ваш компьютер и поменять IP соответсвенно.


В файле [application.properties](.rrfidreader.server/src/main/resources/application.properties)

В этом файле указываете базу данных и зивисимости для нее.


## Использованные технологии

- [Написано на Kotlin с использованием MVVC-архитектуры.](https://medium.com/@anilkumar2681/kotlin-login-demo-using-mvc-pattern-with-validation-a4e030b50f9f)
- [PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps "Прогрессивное веб-приложение (PWA) — это приложение, созданное с использованием технологий веб-платформы, но обеспечивающее пользователю такой же пользовательский интерфейс, как и приложение, предназначенное для конкретной платформы.")

## Работу выполнили студенты 4 курса группы бОИС-211

- Максим Дмитриев
- Данил Тюленев
- Дмитрий Гайдаев
- Людмила Корчанова 
