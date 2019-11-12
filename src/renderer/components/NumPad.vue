<template>
  <div class="numpad">
    <input-field :placeholder="placeholder" :type="inputType" :value="value" readonly />

    <div class="buttons">
      <button type="button" @click="digit('7')">7</button>
      <button type="button" @click="digit('8')">8</button>
      <button type="button" @click="digit('9')">9</button>
      <button type="button" @click="pop()">&#10502;</button>

      <button type="button" @click="digit('4')">4</button>
      <button type="button" @click="digit('5')">5</button>
      <button type="button" @click="digit('6')">6</button>
      <button type="button" @click="reset()">C</button>

      <button type="button" @click="digit('1')">1</button>
      <button type="button" @click="digit('2')">2</button>
      <button type="button" @click="digit('3')">3</button>
      <button type="button" class="cancel" @click="cancel()" :disabled="!$listeners.cancel">&#10006;</button>

      <button type="button" class="zero" @click="digit('0')">0</button>
      <button type="button" class="confirm" @click="confirm()">&#10004;</button>
    </div>
  </div>
</template>

<script>
  import InputField from '@/components/InputField' 

  export default {
    name: 'num-pad',
    components: { InputField, },
    props: {
      max: {
        type: Number,
        required: true
      },
      value: {
        required: false
      },
      placeholder: {
        type: String
      },
      inputType: {
        type: String,
        default: 'text',
        validator: function (value) {       
          return ['password', 'text'].indexOf(value) !== -1
        }
      }
    },
    methods: {
      digit: function(value) {
        if (this.value.length < this.max)
          this.$emit('input', this.value + value)
      },
      pop: function() {
        this.$emit('input', this.value.substring(0, this.value.length-1))
      },
      reset: function() {
        this.$emit('input', '')
      },
      cancel: function() {
        this.$emit('cancel', '')
      },
      confirm: function() {
        this.$emit('confirm', this.value)
      }
    }
  }
</script>

<style lang="scss">
  .numpad {
    border: 1px solid black;
    width: 320px;

    .buttons {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;

      button {
        box-sizing: border-box;
        flex: 1 0 21%;
        padding: 10px;
        border: 1px solid #aaa;
        background: #444;
        color: #fff;
        text-align: center;
        font-size: 1.5em;

        &.zero {
          flex-basis: 71%;
        }

        &.cancel {
          background: #B23025;
        }

        &.confirm {
          background: #1FA83A;
        }

        &:disabled {
          opacity: .6;
          cursor: not-allowed;
        }
      }
    }
  }
</style>