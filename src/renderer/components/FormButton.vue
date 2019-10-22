<template>
  <button class="btn">
      <slot></slot>
  </button>
</template>

<script>
export default {
  props: ['placeholder', 'id', 'required'],
}
</script>

<style lang="scss">
  .btn {
    display: inline-block;
    font-weight: 400;
    color: #212529;
    text-align: center;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-color: transparent;
    border: 1px solid transparent;
    padding: .375rem .75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: .25rem;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;

    &:not(:disabled) {
      cursor: pointer;
    }
    
    &:disabled {
      cursor: not-allowed;
      opacity: .6
    }

    &:focus {
      outline: 0;
      box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
    }

    &.primary {
      color: #fff;
      background-color: #007bff;
      border-color: #007bff;

      &:hover {
        color:#fff;
        background-color:#0069d9;
        border-color:#0062cc
      }
    }

    &.success {
      color: #fff;
      background-color: #28a745;
      border-color: #28a745;

      &:hover {
        color:#fff;
        background-color:#218838;
        border-color:#1e7e34
      }
    }

    &.link {
      font-weight: 400;
      color: #007bff;
      text-decoration: none;

      &:hover {
        color:#0056b3;
        text-decoration:underline
      }
    }
  }
</style>