# Используем официальный образ WordPress с Apache
# Вы можете указать конкретную версию, например, wordpress:6.4.3-apache
FROM wordpress:latest

# Копируем пользовательские темы, плагины и (опционально) uploads из репозитория
# ВАЖНО: uploads лучше не хранить в Git, а монтировать как диск.
# Но если вы хотите включить их в образ для первоначального деплоя (НЕ РЕКОМЕНДУЕТСЯ для больших uploads):
# COPY ./wp-content/ /var/www/html/wp-content/

# Если вы хотите управлять темами и плагинами через Git,
# то этот Dockerfile уже сделает их доступными,
# так как Render при сборке скопирует весь ваш репозиторий,
# а потом подключит диск для wp-content.
# WordPress Docker образ сам настроит wp-config.php на основе переменных окружения.

# (Опционально) Увеличить лимиты PHP, если нужно.
# Раскомментируйте и настройте при необходимости:
# RUN echo "file_uploads = On" >> /usr/local/etc/php/conf.d/uploads.ini && \
#     echo "memory_limit = 256M" >> /usr/local/etc/php/conf.d/uploads.ini && \
#     echo "upload_max_filesize = 64M" >> /usr/local/etc/php/conf.d/uploads.ini && \
#     echo "post_max_size = 64M" >> /usr/local/etc/php/conf.d/uploads.ini && \
#     echo "max_execution_time = 300" >> /usr/local/etc/php/conf.d/uploads.ini

# (Опционально) Установить доп. расширения PHP, если они нужны вашим плагинам
# RUN docker-php-ext-install mysqli pdo pdo_mysql && docker-php-ext-enable mysqli
# RUN docker-php-ext-install gd # Пример для графической библиотеки

# Убедимся, что у www-data есть права на wp-content, если мы что-то копировали выше.
# Обычно это не требуется, если диск монтируется правильно.
# RUN chown -R www-data:www-data /var/www/html/wp-content