package com.rfidreader.infrastructures.handlers

import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.env.Environment
import org.springframework.http.HttpMethod
import org.springframework.stereotype.Component
import org.springframework.web.servlet.HandlerInterceptor

@Component
class ApiKeyInterceptorHandler(private val environment: Environment): HandlerInterceptor  {
    companion object {
        private const val API_KEY_HEADER = "API-KEY"
    }
    override fun preHandle(request: HttpServletRequest, response: HttpServletResponse, handler: Any): Boolean {
        if (request.method == HttpMethod.OPTIONS.name()){
            response.status = HttpServletResponse.SC_OK
            return true
        }
        request.getHeader(API_KEY_HEADER).let {
            if (it == null || it != environment.getProperty("security.api-key")) {
                response.status = HttpServletResponse.SC_UNAUTHORIZED
                response.writer.write("Unauthorized")
                return false
            }
            return true
        }
    }
}