package com.ez;

import org.apache.commons.lang3.StringUtils;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

@SpringBootTest
public class TestABC {

    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Test
    public void abc(){

        Date date = new Date();
//        StringUtils.
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
        String strDate = dateFormat.format(date);

        LOGGER.info(UUID.randomUUID().toString());
        LOGGER.info(strDate + "_" + UUID.randomUUID().toString());
    }
}
