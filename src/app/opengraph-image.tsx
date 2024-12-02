import Image from 'next/image'
 
export default function Page() {
  return (
    <div>
      <Image
        src="/crypto_onramp.png"
        width={500}
        height={500}
        alt="Crypto Onramp"
      />
    </div>
  )
}