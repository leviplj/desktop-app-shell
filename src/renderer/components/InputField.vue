<template>
  <div class="field">
    <input :class="innherClass" :type="type" placeholder=" " :id="id" :required="required" @input="$emit('input', $event.target.value)" :value="value" :readonly="readonly">
    <label for="">
      <span class="placeholder">
        {{placeholder}}
      </span>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String
    },
    id: {
      type: String
    },
    required:{
      type: Boolean
    },
    value:{ },
    innherClass:{
      type: String
    },
    readonly:{
      type: Boolean
    },
    type: {
      type: String,
      default: 'text',
      validator: function (value) {       
        return ['password', 'text'].indexOf(value) !== -1
      }
    }
  }
}
</script>

<style lang="scss">
  .field {
    position: relative;
    overflow: hidden;
    height: 2rem;
    margin: .25rem 0;

    input {
      height: 100%;
      width: 100%;
      padding-top: 1rem;
      border: none;
      outline: none;
      background: inherit;
    }

    input + label {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 100%;
      width: 100%;
      border-bottom: 1px solid black;
      pointer-events: none;
    }

    label::after {
      content: "";
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 100%;
      border-bottom: 1.5px solid navy;
      transform: translateX(-100%);
      transition: all .3s ease;
    }

    .placeholder {
      position: absolute;
      bottom: 0;
      color: #8b8b8b;
      transition: all .3s ease;
    }

    input:not(:placeholder-shown) + label::after,
    input:focus + label::after,
    input.invalid + label::after {
      transform: translateX(0);
    }

    input:not(:placeholder-shown) + label .placeholder,
    input:focus + label .placeholder,
    input.invalid + label .placeholder {
      color: navy;
      font-size: .8em;
      font-weight: 700;
      transform: translateY(-100%);
    }

    input.invalid + label .placeholder {
      color: red;
    }

    input.invalid + label::after {
      border-color: red;
    }
  }
</style>