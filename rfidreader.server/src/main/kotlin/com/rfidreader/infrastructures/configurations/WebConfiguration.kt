package com.rfidreader.infrastructures.configurations

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.rfidreader.infrastructures.handlers.ApiKeyInterceptorHandler
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.env.Environment
import org.springframework.http.converter.HttpMessageConverter
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter
import org.springframework.validation.annotation.Validated
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.EnableWebMvc
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
@EnableWebMvc
class WebConfiguration(val apiKeyInterceptor: ApiKeyInterceptorHandler) : WebMvcConfigurer {
    @Autowired
    private lateinit var environment: Environment

    override fun addInterceptors(registry: InterceptorRegistry) {
        registry.addInterceptor(apiKeyInterceptor).addPathPatterns("/api/**")
    }
    override fun addCorsMappings(registry: CorsRegistry) {
        val origins = environment.getProperty("security.allow-origin", Array<String>::class.java)
        registry.addMapping("/**")
            .allowedOrigins(*origins!!)
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
    }
}