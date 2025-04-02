import { Time } from 'common'

/*
This value rarely changes. Moreover, it is unlikely to vary depending on the theater or service.
Therefore, it is unnecessary to set it through configuration or to inject it from an external source.

이 값은 거의 변경되지 않는다. 또한 극장이나 서비스 마다 달라질 가능성도 없다.
그래서 환경설정으로 설정하게 하거나 외부에서 주입받는 것은 불필요하다.
*/
export const Rules = {
    Ticket: {
        /*
        티켓 구매 가능 시간
         */
        purchaseDeadlineMinutes: 30,

        /*
        최대 구매 가능 수
        */
        maxTicketsPerPurchase: 10,

        /*
        티켓 선점 시간
        */
        holdExpirationTime: Time.toMs('10m')
    }
}
