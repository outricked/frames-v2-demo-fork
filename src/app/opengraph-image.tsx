import Image from 'next/image'
 
export default function Picture() {
  return (
    <div>
      <Image
        src="/crypto_onramp.png"
        width={800}
        height={800}
        alt="Crypto Onramp"
      />
    </div>
  )
}