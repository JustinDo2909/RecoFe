import Container from '@/components/Container'
import Consultation from '@/components/CustomService/Consultation'
import CustomBanner from '@/components/CustomService/CustomBanner'
import Customization from '@/components/CustomService/Customization'
import Engraving from '@/components/CustomService/Engraving'
import Feedback from '@/components/CustomService/Feedback'
import Materials from '@/components/CustomService/Materials'
import Renewal from '@/components/CustomService/Renewal'
import React from 'react'

console.log("Container:", Container);
console.log("CustomBanner:", CustomBanner);
console.log("Customization:", Customization);
console.log("Materials:", Materials);
console.log("Engraving:", Engraving);
console.log("Renewal:", Renewal);
console.log("Feedback:", Feedback);
console.log("Consultation:", Consultation);

const CustomPage = () => {
  return (
    <Container>
        <CustomBanner/>
        <Customization/>
        <Materials/>
        <Engraving/>
        <Renewal/>
        <Feedback/>
        <Consultation/>
    </Container>
  )
}

export default CustomPage
