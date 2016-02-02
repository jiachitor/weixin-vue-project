<template>
  <div>
    <a v-link="{ path: '/wx/' }">app</a>
    <h3>user profile</h3>
    <a v-link="{ path: '/wx/about' }">about</a>
    <p>{{$route.params.userId}} {{$route.params.something}}</p>
  </div>
</template>
