import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
    FieldSeparator,
} from "@/components/ui/field"

export function MockCheckoutPage() {
    const [paymentMethod, setPaymentMethod] = useState<"card" | "wallet" | "cod">("card")
    const mockOrder = {
        product: "Consulting + Software Fee",
        description: "Monthly payment for software subscription and psychologist consulting.",
        subtotal: 150.0,
        shipping: 10.0,
        tax: 15.0,
    }
    const total = mockOrder.subtotal + mockOrder.shipping + mockOrder.tax

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        alert("Pagamento simulado concluído!")
    }

    return (
        <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Address + Payment */}
            <div className="space-y-6">
                {/* Shipping Address */}
                <FieldSet>
                    <FieldLegend>Billing / Shipping Address</FieldLegend>
                    <FieldDescription>All transactions are secure and encrypted</FieldDescription>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="name">Full Name</FieldLabel>
                            <Input id="name" placeholder="First & Last Name" defaultValue="Dra. Mariana Almeida" />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="address1">Address 1</FieldLabel>
                            <Input id="address1" placeholder="Street, number" defaultValue="Av. Paulista, 1000" />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="address2">Address 2</FieldLabel>
                            <Input id="address2" placeholder="Apartment, suite, etc." />
                        </Field>
                        <div className="grid grid-cols-3 gap-4">
                            <Field>
                                <FieldLabel htmlFor="city">City</FieldLabel>
                                <Input id="city" placeholder="City" defaultValue="São Paulo" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="state">State</FieldLabel>
                                <Select defaultValue="SP">
                                    <SelectTrigger id="state">
                                        <SelectValue placeholder="Select state" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SP">SP</SelectItem>
                                        <SelectItem value="RJ">RJ</SelectItem>
                                        <SelectItem value="MG">MG</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="zip">Zip</FieldLabel>
                                <Input id="zip" placeholder="00000-000" defaultValue="01310-100" />
                            </Field>
                        </div>
                    </FieldGroup>
                </FieldSet>

                <FieldSeparator />

                {/* Payment Method */}
                <FieldSet>
                    <FieldLegend>Payment Method</FieldLegend>
                    <FieldGroup className="flex gap-4 mb-4">
                        <Button variant={paymentMethod === "card" ? "default" : "outline"} onClick={() => setPaymentMethod("card")}>
                            Card
                        </Button>
                        <Button variant={paymentMethod === "wallet" ? "default" : "outline"} onClick={() => setPaymentMethod("wallet")}>
                            Wallet
                        </Button>
                        <Button variant={paymentMethod === "cod" ? "default" : "outline"} onClick={() => setPaymentMethod("cod")}>
                            COD
                        </Button>
                    </FieldGroup>

                    {paymentMethod === "card" && (
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="card-name">Name on Card</FieldLabel>
                                <Input id="card-name" placeholder="First & Last Name" defaultValue="Dra. Mariana Almeida" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="card-number">Card Number</FieldLabel>
                                <Input id="card-number" placeholder="0000 0000 0000 0000" defaultValue="1234 5678 9012 3456" />
                            </Field>
                            <div className="grid grid-cols-3 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="exp-month">Month</FieldLabel>
                                    <Select defaultValue="08">
                                        <SelectTrigger id="exp-month">
                                            <SelectValue placeholder="MM" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 12 }, (_, i) => (
                                                <SelectItem key={i} value={(i + 1).toString().padStart(2, "0")}>
                                                    {(i + 1).toString().padStart(2, "0")}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="exp-year">Year</FieldLabel>
                                    <Select defaultValue="2025">
                                        <SelectTrigger id="exp-year">
                                            <SelectValue placeholder="YYYY" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 6 }, (_, i) => {
                                                const year = 2024 + i
                                                return <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                            })}
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="cvv">CVV</FieldLabel>
                                    <Input id="cvv" placeholder="123" defaultValue="123" />
                                </Field>
                            </div>
                        </FieldGroup>
                    )}
                </FieldSet>

                <FieldSet>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="comments">Comments</FieldLabel>
                            <Textarea id="comments" placeholder="Add any additional comments" defaultValue="Pagamento referente à mensalidade do software e psicólogo." />
                        </Field>
                    </FieldGroup>
                </FieldSet>

                <Button className="mt-4 w-full" type="submit" onClick={handleSubmit}>
                    Place Order
                </Button>
            </div>

            {/* Right Column: Order Summary */}
            <div className="bg-card p-6 rounded-lg shadow space-y-4">
                <h2 className="text-lg font-bold">Order Summary</h2>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-200 rounded" />
                    <div>
                        <p className="font-semibold">{mockOrder.product}</p>
                        <p className="text-sm text-muted-foreground">{mockOrder.description}</p>
                    </div>
                </div>
                <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${mockOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>${mockOrder.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tax</span>
                        <span>${mockOrder.tax.toFixed(2)}</span>
                    </div>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                <Button className="w-full mt-4" onClick={handleSubmit}>
                    Place Order
                </Button>
            </div>
        </div>
    )
}
