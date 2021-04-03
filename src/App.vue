<template>
  <div id="app" class="wrap">
    <h1 class="title">Кредитный калькулятор</h1>

    <div class="input_info">
      <div class="main_button">
        <button
          class="main_button_el"
          :disabled="disabled1"
          @click="changeTitile1($event)"
        >
          Кредит
        </button>
        <button
          class="main_button_el"
          :disabled="disabled"
          @click="changeTitile2($event)"
        >
          Платеж
        </button>
      </div>

      <div class="container_element first_ce">
        <h2 class="subtitle">{{ titleCredit }}</h2>
        <input
          class="input_box inbf"
          type="text"
          :value="summCredit"
          @input="Summ"
          @keypress="isNumber($event)"
        />
        <select class="arrow" v-model="innerValueMoney">
          <option value="₽">₽</option>
          <option value="$">$</option>
          <option value="€">€</option>
        </select>
      </div>
      <div class="container_element">
        <h2 class="subtitle">{{ titleTerm }}</h2>
        <input
          class="input_box"
          type="text"
          :value="termCredit"
          @input="Term"
          @keypress="isNumber($event)"
        />
        <select v-model="innerValue" class="arrow">
          <option value="month">Месяц</option>
          <option value="year">Год</option>
        </select>
      </div>
      <div class="container_element">
        <h2 class="subtitle">Процентная ставка</h2>
        <input
          class="input_box ratest"
          type="text"
          :value="interestRate"
          @input="Rate"
          @keypress="isNumber($event)"
        />
      </div>

      <div class="container_element last_ce">
        <h2 class="subtitle">Вид платежа</h2>
        <select v-model="innerValueType" class="selectf" :disabled="disabled2">
          <option>Аннуитетный</option>
          <option>Дифференцированный</option>
        </select>
      </div>
    </div>
   

    <div class="main_calc">
      <button class="btn_calculate" @click="Op($event)">Рассчитать</button>
      
    </div>

 
 

    <div id="print" class="all_print" v-show="isEVis">
      <div class="p">
        <div class="result">
          <h2 class="res_title">
            Выплачиваемая сумма: {{ amountPaid | num("num") }} {{ znak }}
          </h2>
          <h2 class="res_title">
            Переплата: {{ overpayment | num("num") }} {{ znak }}
          </h2>
          <h2 class="res_title">
            {{ titleCrOrPayment }} {{ monthlyPaymentAmount | num("num") }}
            {{ maxmonthlyPaymentAmount | num("num dot") }}
            {{ minmonthlyPaymentAmount | num("num") }} {{ znak }}
          </h2>
        </div>
        <button @click="down" class="prbtn"></button>
      </div>
      <ul class="list" v-show="isEVis">
        <li class="list_element">
          <p class="list_p">№</p>
          <p class="list_p">Сумма платежа</p>
          <p class="list_p">Основной долг</p>
          <p class="list_p">Начисленные проценты</p>
          <p class="list_p">Остаток задолженности</p>
        </li>

        <ul v-for="item in items" :key="item.aname" class="list_element">
          <li class="list_element_item">
            {{ item.idPayment }}
          </li>

          <li class="list_element_item">
            {{ item.summPayment | num("num") }}
          </li>
          <li class="list_element_item">
            {{ item.base | num("num") }}
          </li>
          <li class="list_element_item">
            {{ item.nrate | num("num") }}
          </li>
          <li class="list_element_item">
            {{ item.ostatok | num("num") }}
          </li>
        </ul>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      titleCredit: "Сумма кредита",
      titleTerm: "Срок кредита",
      summCredit: "",
      termCredit: "",
      term: 0,
      interestRate: "",
      amountPaid: 0,
      overpayment: 0,
      monthlyPaymentAmount: 0,
      i: 0,
      innerValue: "",
      titleCrOrPayment: "",
      // bDateM: 0,
      b: 0,
      items: [],
      fromTime: 0,
      XOST: 0,
      col: true,
      isEVis: false,
      r: [],
      c: [],
      itemssave: [],
      maxmonthlyPaymentAmount: 0,
      minmonthlyPaymentAmount: 0,
      us: 0,
      znak: "",
      innerValueType: "Аннуитетный",
      innerValueMoney: "₽",
      innerValue: "year",
      K: 0
    };
  },
  methods: {
    Summ(event) {
      this.summCredit = event.target.value;
    },

    Term(event) {
      this.termCredit = event.target.value;
    },
    Rate(event) {
      this.interestRate = event.target.value;
    },

    isNumber: function(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    changeTitile1() {
      this.titleCredit = "Сумма кредита";
      this.titleTerm = "Срок кредита";
      this.titleCrOrPayment = "Сумма ежемесячного платежа:";
    },
    changeTitile2() {
      this.titleCredit = "Сумма платежа";
      this.titleTerm = "Срок выплат";
      this.titleCrOrPayment = "Сумма кредита";
    },

    Op(event) {
      this.monthlyPaymentAmount = "";
      this.amountPaid = "";
      this.overpayment = "";
      if (
        this.summCredit == "" ||
        this.termCredit == "" ||
        this.interestRate == ""
      ) {
        return alert("Введите данные");
      }
      if (this.innerValueMoney === "$") {
        this.znak = "$";
      } else if (this.innerValueMoney === "₽") {
        this.znak = "₽";
      } else {
        this.znak = "€";
      }
      if (this.innerValue === "year") {
        this.term = this.termCredit * 12;
      } else {
        this.term = this.termCredit;
      }

      if (this.innerValueType === "Аннуитетный") {
        this.i = this.interestRate / 100 / 12;
        if (this.titleCredit === "Сумма кредита") {
          this.monthlyPaymentAmount =
            this.summCredit *
            (this.i + this.i / (Math.pow(this.i + 1, this.term) - 1));

          this.amountPaid = Math.round(this.monthlyPaymentAmount * this.term);
          this.overpayment = Math.round(this.amountPaid - this.summCredit);
          this.XOST = this.summCredit;
          if (this.items) {
            for (let s = 0; s < this.term; s++) {
              this.items.splice(s);
            }
          }
          for (let s = 0; s < this.term; s++) {
            this.items.push({
              idPayment: s + 1,
              summPayment: this.monthlyPaymentAmount,
              nrate: (this.XOST * this.interestRate) / 12 / 100,
              base:
                this.monthlyPaymentAmount -
                (this.XOST * this.interestRate) / 12 / 100,

              ostatok: Math.abs(
                this.XOST -
                  (this.monthlyPaymentAmount -
                    (this.XOST * this.interestRate) / 12 / 100)
              )
            });
            this.XOST =
              this.XOST -
              (this.monthlyPaymentAmount -
                (this.XOST * this.interestRate) / 12 / 100);
            this.maxmonthlyPaymentAmount = 0;
            this.minmonthlyPaymentAmount = 0;

            this.isEVis = true;
          }
        } else {
          this.K =
            (this.i * Math.pow(1 + this.i, this.term)) /
            (Math.pow(1 + this.i, this.term) - 1);
          this.monthlyPaymentAmount = Math.round(this.summCredit / this.K);

          this.amountPaid = Math.round(this.summCredit * this.term);

          this.overpayment = Math.round(
            this.amountPaid - this.monthlyPaymentAmount
          );
          this.XOST = this.monthlyPaymentAmount;
          if (this.items) {
            for (let s = 0; s < this.term; s++) {
              this.items.splice(s);
            }
          }
          for (let s = 0; s < this.term; s++) {
            this.items.push({
              idPayment: s + 1,
              summPayment: this.summCredit,
              nrate: (this.XOST * this.interestRate) / 12 / 100,
              base:
                this.summCredit - (this.XOST * this.interestRate) / 12 / 100,

              ostatok: Math.abs(
                this.XOST -
                  (this.summCredit - (this.XOST * this.interestRate) / 12 / 100)
              )
            });
            this.XOST =
              this.XOST -
              (this.summCredit - (this.XOST * this.interestRate) / 12 / 100);
            this.maxmonthlyPaymentAmount = 0;
            this.minmonthlyPaymentAmount = 0;

            this.isEVis = true;
          }
        }
      } else if (this.innerValueType === "Дифференцированный") {
        if (this.items) {
          for (let s = 0; s < this.term; s++) {
            this.items.splice(s);
          }
        }
        if (this.innerValue === "year") {
          this.term = this.termCredit * 12;
        } else {
          this.term = this.termCredit;
        }

        this.i = this.interestRate / 100 / 12;

        this.maxmonthlyPaymentAmount =
          this.summCredit / this.term + this.summCredit * this.i;
        this.minmonthlyPaymentAmount =
          this.summCredit / this.term +
          (this.summCredit - (this.summCredit / this.term) * this.term) *
            this.i;

        this.monthlyPaymentAmount =
          this.maxmonthlyPaymentAmount.toFixed(2) +
          " ... " +
          this.minmonthlyPaymentAmount.toFixed(2);

        this.amountPaid = Math.round(this.monthlyPaymentAmount * this.term);
        this.overpayment = Math.round(this.amountPaid - this.summCredit);

        //
        for (let s = 0; s < this.term; s++) {
          this.items.push({
            idPayment: s + 1,

            base: this.summCredit / this.term,
            ostatok: Math.abs(
              this.summCredit - (this.summCredit / this.term) * (s + 1)
            ),
            nrate:
              (this.summCredit - (this.summCredit / this.term) * s) * this.i,

            summPayment:
              this.summCredit / this.term +
              (this.summCredit - (this.summCredit / this.term) * s) * this.i
          });

          this.XOST =
            this.XOST +
            this.summCredit / this.term +
            (this.summCredit - (this.summCredit / this.term) * s) * this.i;
        }
        this.amountPaid = this.XOST;
        this.overpayment = this.amountPaid - this.summCredit;
        this.monthlyPaymentAmount = 0;

        this.isEVis = true;
      }
    },
    down() {
      this.$htmlToPaper("print");
    }
  },
  computed: {
    disabled: function() {
      if (this.innerValueType === "Дифференцированный") {
        return true;
      } else {
        return this.titleCredit === "Сумма платежа" ? true : false;
      }
    },
    disabled1: function() {
      return this.titleCredit === "Сумма кредита" ? true : false;
    },
    disabled2: function() {
      return this.titleCredit === "Сумма платежа" ? true : false;
    }
  }
};
</script>

<style lang="css"></style>
