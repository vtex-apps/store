declare module 'splunk-events' {
  interface Constructable<T> {
    new (): T
  }
  const Splunk: Constructable<any>
  export default Splunk
}
